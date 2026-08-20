import {
  resolveAmbientMotion,
  shigoHoverLift,
  shigoPress,
  shigoSpringSnappy,
  shigoSpringSoft,
} from "./shigo-motion";

describe("Shigo motion language", () => {
  it("keeps tactile motion restrained", () => {
    expect(shigoHoverLift).toEqual({ y: -1, scale: 1.015 });
    expect(shigoPress.scale).toBeGreaterThanOrEqual(0.97);
    expect(shigoPress.scale).toBeLessThan(1);
    expect(shigoSpringSoft.type).toBe("spring");
    expect(shigoSpringSnappy.type).toBe("spring");
  });

  it("removes continuous ambient transforms for reduced motion", () => {
    expect(resolveAmbientMotion(true)).toEqual({ scale: 1, x: 0, y: 0 });
    expect(resolveAmbientMotion(false)).toEqual({ scale: [1, 1.03, 1], x: [0, 6, 0], y: [0, -2, 0] });
  });
});
