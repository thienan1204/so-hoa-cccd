export interface ExtractedData {
  hoTen: string;
  soCCCD: string;
  ngayCap: string;
  diaChi: string;
}

export interface OcrResult {
  rawText: string;
  extractedData: ExtractedData;
}
