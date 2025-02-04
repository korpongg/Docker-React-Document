import styled from "styled-components";
import Box from "@mui/material/Box";

export const ReportFileBox = styled(Box)`
  .AreaBOX {
    text-align: left;
  }
  .AreaBOX .file-input-label, .AreaBOX input[type="file"] {
    align-items: center;
    background: unset;
    border: 1px solid lightgray;
    border-radius: 6px;
    color: #000;
    cursor: pointer;
    display: flex;
    font-family: inherit;
    font-size: 1.125rem;
    padding: 6px 10px;
  }
  .AreaBOX .file-input-label .file-selected {
    align-items: flex-end;
    background: #6b6b6b;
    border-radius: 4px;
    color: #fff;
    display: flex;
    font-size: 0.875rem;
    margin-right: 4px;
    padding: 3px 8px;
  }
  .AreaBOX .file-input-label .file-selected:hover {
    background: #008000;
  }
  .AreaBOX .file-input-label span.text {
    line-height: 1;
  }
  .AreaBOX span.remark {
    color: red;
    font-size: 0.9rem;
    margin-top: -10px;
  }
  .AreaBOX .Download, .AreaBOX .Download a {
    align-items: center;
    display: flex;
  }
  .AreaBOX .Download svg {
    color: #4169e1;
    cursor: pointer;
    margin-left: 10px;
  }

  #reportImage.AreaBOX {
    border-radius: unset;
    margin: 10px 0px 5px 20px;
  }
  #reportImage.AreaBOX .imgViewer {
    margin-bottom: 10px;
    max-height: 300px;
    overflow: auto;
  }
  #reportImage.AreaBOX img.preview-img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  #reportFile.AreaBOX {
    margin: 5px 0px 10px 20px;
  }
  #reportFile.AreaBOX .docViewer {
    max-height: 520px;
    overflow: auto;
  }
`;