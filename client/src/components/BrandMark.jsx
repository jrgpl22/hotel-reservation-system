import logo from "../assets/hearts-logo.png";
import { BRAND_NAME } from "../utils/constants";

// Logo image beside the brand name. Use onDark on the dark green sidebar and footer.
function BrandMark({ size = 36, onDark = false }) {
  return (
    <span className="brand-mark">
      <img
        src={logo}
        alt=""
        className={`brand-logo${onDark ? " on-dark" : ""}`}
        style={{ height: size }}
      />
      <span>{BRAND_NAME}</span>
    </span>
  );
}

export default BrandMark;
