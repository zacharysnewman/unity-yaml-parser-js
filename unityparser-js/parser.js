const {
  Parser: YamlParser,
  types: {
    Type,
    FAILSAFE_SCHEMA,
    JSON_SCHEMA,
    CORE_SCHEMA,
    DEFAULT_SAFE_SCHEMA,
    DEFAULT_FULL_SCHEMA,
  },
  exceptions: { MarkedYAMLError, YAMLException },
  tokens: { StreamEndToken, BlockEndToken },
  events: { StreamEndEvent, DocumentStartEvent, MappingEndEvent },
} = require("js-yaml");

class Parser extends YamlParser {
  constructor() {
    super();
    this.parsing_inverted_scalar = false;
  }

  parse_document_start() {
    while (this.check_token(BlockEndToken)) {
      this.get_token();
    }

    if (!this.check_token(StreamEndToken)) {
      const token = this.peek_token();
      const start_mark = token.start_mark;

      let version, tags;
      if (this.check_prev_token(StreamEndToken)) {
        [version, tags] = this.process_directives();
      } else {
        version = this.yaml_version;
        tags = this.tag_handles ? { ...this.tag_handles } : null;
      }
      if (!this.check_token(BlockEndToken)) {
        throw new MarkedYAMLError(
          null,
          null,
          `expected '<document start>', but found ${this.peek_token().id}`,
          this.peek_token().start_mark
        );
      }
      token = this.get_token();
      const end_mark = token.end_mark;
      const event = new DocumentStartEvent(
        start_mark,
        end_mark,
        true,
        version,
        tags
      );

      this.states.push(this.parse_document_end);
      this.state = this.parse_document_content;
    } else {
      const token = this.get_token();
      const event = new StreamEndEvent(token.start_mark, token.end_mark);

      if (this.states.length || this.marks.length) {
        throw new YAMLException("Invalid state");
      }

      this.state = null;
    }

    return event;
  }

  parse_block_mapping_key() {
    if (this.check_token(BlockEndToken)) {
      const token = this.get_token();

      if (!this.check_token(BlockEndToken)) {
        this.states.push(this.parse_block_mapping_value);
        return this.parse_block_node_or_indentless_sequence();
      } else {
        this.state = this.parse_block_mapping_value;
        return this.process_empty_scalar(token.end_mark);
      }
    }

    if (!this.check_token(BlockEndToken) && !this.parsing_inverted_scalar) {
      if (this.check_token(BlockEndToken)) {
        this.get_token();
        this.parsing_inverted_scalar = true;
        this.states.push(this.parse_block_mapping_value);
        return this.parse_block_node_or_indentless_sequence();
      } else {
        const token = this.peek_token();
        throw new MarkedYAMLError(
          "while parsing a block mapping",
          this.marks[this.marks.length - 1],
          `expected <block end>, but found ${token.id}`,
          token.start_mark
        );
      }
    }

    const token = this.get_token();
    const event = new MappingEndEvent(token.start_mark, token.end_mark);
    this.state = this.states.pop();
    this.marks.pop();
    this.parsing_inverted_scalar = false;
    return event;
  }
}

module.exports = Parser;
