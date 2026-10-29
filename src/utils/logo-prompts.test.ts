import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  validateImageSize, 
  validateVideoAspectRatio, 
  buildLogoPrompt, 
  buildMotionPrompt,
  STYLE_DESCRIPTIONS,
  MOTION_PRESETS
} from './logo-prompts.ts';

test('validateImageSize only accepts 1K, 2K, 4K and defaults to 2K for invalid values', () => {
  assert.equal(validateImageSize('1K'), '1K');
  assert.equal(validateImageSize('2K'), '2K');
  assert.equal(validateImageSize('4K'), '4K');
  assert.equal(validateImageSize('8K'), '2K');
  assert.equal(validateImageSize(''), '2K');
  assert.equal(validateImageSize('unknown'), '2K');
});

test('validateVideoAspectRatio only accepts 16:9 and 9:16 and defaults to 16:9', () => {
  assert.equal(validateVideoAspectRatio('16:9'), '16:9');
  assert.equal(validateVideoAspectRatio('9:16'), '9:16');
  assert.equal(validateVideoAspectRatio('4:3'), '16:9');
  assert.equal(validateVideoAspectRatio('1:1'), '16:9');
});

test('buildLogoPrompt incorporates company name, industry, style, and tagline correctly', () => {
  const prompt = buildLogoPrompt({
    companyName: 'Apex Quantum',
    industry: 'Quantum Computing',
    description: 'Next gen quantum processor for cryogenic environments',
    tagline: 'Compute without limits',
    style: 'geometric-abstract',
    colorPalette: 'Deep Cyan and Neon Blue',
    imageSize: '4K'
  });

  assert.ok(prompt.includes('Apex Quantum'));
  assert.ok(prompt.includes('Quantum Computing'));
  assert.ok(prompt.includes('Compute without limits'));
  assert.ok(prompt.includes(STYLE_DESCRIPTIONS['geometric-abstract']));
  assert.ok(prompt.includes('Deep Cyan and Neon Blue'));
});

test('buildMotionPrompt handles 16:9 widescreen vs 9:16 vertical correctly', () => {
  const widescreenPrompt = buildMotionPrompt({
    motionStyle: MOTION_PRESETS[0].id,
    aspectRatio: '16:9',
    customInstructions: 'Glow brighter near the end'
  });

  assert.ok(widescreenPrompt.includes('16:9'));
  assert.ok(widescreenPrompt.includes('Glow brighter near the end'));

  const verticalPrompt = buildMotionPrompt({
    motionStyle: MOTION_PRESETS[1].name,
    aspectRatio: '9:16'
  });

  assert.ok(verticalPrompt.includes('9:16'));
});
