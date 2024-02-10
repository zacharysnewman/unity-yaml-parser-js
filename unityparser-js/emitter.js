const yaml = require("js-yaml");
const EmitterError = yaml.exceptions.YAMLException;
const {
  DocumentStartEvent,
  StreamEndEvent,
  AliasEvent,
  ScalarEvent,
  CollectionStartEvent,
  SequenceStartEvent,
  MappingStartEvent,
} = yaml.events;
class Emitter extends yaml.Emitter {
  expect_document_start(first = false) {
    if (this.event instanceof DocumentStartEvent) {
      if (this.event.version && first) {
        const version_text = this.prepare_version(this.event.version);
        this.write_version_directive(version_text);
      }
      this.tag_prefixes = Object.assign({}, this.DEFAULT_TAG_PREFIXES);
      if (this.event.tags) {
        const handles = Object.keys(this.event.tags).sort();
        for (let handle of handles) {
          const prefix = this.event.tags[handle];
          this.tag_prefixes[prefix] = handle;
          if (first) {
            const handle_text = this.prepare_tag_handle(handle);
            const prefix_text = this.prepare_tag_prefix(prefix);
            this.write_tag_directive(handle_text, prefix_text);
          }
        }
      }
      const implicit =
        first &&
        !this.event.explicit &&
        !this.canonical &&
        !this.event.version &&
        !this.event.tags &&
        !this.check_empty_document();
      if (!implicit) {
        this.write_indent();
        this.write_indicator("---", true);
        if (this.canonical) {
          this.write_indent();
        }
      }
      this.state = this.expect_document_root;
    } else if (this.event instanceof StreamEndEvent) {
      this.write_stream_end();
      this.state = this.expect_nothing;
    } else {
      throw new EmitterError(
        `expected DocumentStartEvent, but got ${this.event}`
      );
    }
  }
  expect_node(
    root = false,
    sequence = false,
    mapping = false,
    simple_key = false
  ) {
    this.root_context = root;
    this.sequence_context = sequence;
    this.mapping_context = mapping;
    this.simple_key_context = simple_key;
    if (this.event instanceof AliasEvent) {
      this.expect_alias();
    } else if (
      this.event instanceof ScalarEvent ||
      this.event instanceof CollectionStartEvent
    ) {
      this.process_tag();
      this.process_anchor("&");
      this.process_anchor_extra();
      if (this.event instanceof ScalarEvent) {
        this.expect_scalar();
      } else if (this.event instanceof SequenceStartEvent) {
        if (
          this.flow_level ||
          this.canonical ||
          this.event.flow_style ||
          this.check_empty_sequence()
        ) {
          this.expect_flow_sequence();
        } else {
          this.expect_block_sequence();
        }
      } else if (this.event instanceof MappingStartEvent) {
        if (
          this.flow_level ||
          this.canonical ||
          this.event.flow_style ||
          this.check_empty_mapping()
        ) {
          this.expect_flow_mapping();
        } else {
          this.expect_block_mapping();
        }
      }
    } else {
      throw new EmitterError(`expected NodeEvent, but got ${this.event}`);
    }
  }

  write_plain(text, split = true) {
    // omitted for brevity
  }
  write_double_quoted(text, split = true) {
    // omitted for brevity
  }
  process_anchor_extra() {
    if (!this.event.anchor || !(this.event.anchor in this.extra_anchor_data)) {
      return;
    }
    this.write_indicator(this.extra_anchor_data[this.event.anchor], false);
  }
}
