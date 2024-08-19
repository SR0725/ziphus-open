import type {
  PDFDocumentProxy,
  DocumentInitParameters,
  TypedArray,
  TextItem,
} from "pdfjs-dist/types/display/api";

interface Page {
  index: number;
  items: TextItem[];
}
interface Font {
  ids: Set<string>;
  map: Map<string, any>;
}
interface Metadata {
  info: Object;
  metadata: {
    parsedData: any;
    rawData: any;
    getRaw: () => any;
    get: (name: any) => any;
    getAll: () => any;
    has: (name: any) => any;
  };
}

/**
 * Converts a PDF file to a Markdown string.
 *
 * @param {string | URL | TypedArray | ArrayBuffer | DocumentInitParameters} pdfBuffer - The PDF file to convert.
 * @param {object} callbacks - Optional callbacks for various events during the conversion process.
 * @param {function} callbacks.metadataParsed - Callback for when metadata is parsed.
 * @param {function} callbacks.pageParsed - Callback for when each page is parsed.
 * @param {function} callbacks.fontParsed - Callback for when a font is parsed.
 * @param {function} callbacks.documentParsed - Callback for when the entire document is parsed.
 * @return {Promise<string>} A promise that resolves to the converted Markdown string.
 */
declare function pdf2md(
  pdfBuffer: string | URL | TypedArray | ArrayBuffer | DocumentInitParameters,
  callbacks?: {
    metadataParsed?: (metadata: Metadata) => void;
    pageParsed?: (pages: Page[]) => void;
    fontParsed?: (font: Font) => void;
    documentParsed?: (document: PDFDocumentProxy, pages: Page[]) => void;
  }
): Promise<string[]>;

export default pdf2md;
