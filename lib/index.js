/**
 * dsh-preset-claude-code
 * Entry point for DSH host lifecycle
 */
export default class ClaudeCodePresetPlugin {
  static name = 'dsh-preset-claude-code';

  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config || {};
  }
}
