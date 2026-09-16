export type DocumentContent =
    | {
          kind: 'text';
          heading: string;
          paragraphs: string[];
          highlights?: string[];
      }
    | {
          kind: 'table';
          caption: string;
          columns: string[];
          rows: string[][];
      }
    | {
          kind: 'file';
          url: string;
          mimeType: string;
      };

export type DocumentRecord = {
    content: DocumentContent;
    id: string;
    name: string;
    extension: string;
    sizeInBytes: number;
    uploadedAt: string;
};
