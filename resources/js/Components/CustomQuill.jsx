import React, { useRef } from "react";
import ReactQuill from "react-quill";

const CustomQuill = React.forwardRef((props, ref) => (
    <ReactQuill ref={ref} {...props} />
));

export default CustomQuill;
