import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcrService } from './services/ocr.service';
import { OcrResult } from './ocr-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class AppComponent {
  private ocrService = inject(OcrService);

  selectedFile: WritableSignal<File | null> = signal(null);
  imagePreviewUrl: WritableSignal<string | null> = signal(null);
  isProcessing: WritableSignal<boolean> = signal(false);
  ocrResult: WritableSignal<OcrResult | null> = signal(null);
  saveStatus: WritableSignal<'idle' | 'success'> = signal('idle');
  error: WritableSignal<string | null> = signal(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.error.set(null);
        this.selectedFile.set(file);
        this.imagePreviewUrl.set(URL.createObjectURL(file));
        this.ocrResult.set(null);
        this.saveStatus.set('idle');
      } else {
        this.error.set('Tệp không hợp lệ. Vui lòng chọn một file ảnh (JPG, PNG).');
        this.reset();
      }
    }
  }

  async performOcr(): Promise<void> {
    const file = this.selectedFile();
    if (!file) return;

    this.isProcessing.set(true);
    this.ocrResult.set(null);
    this.saveStatus.set('idle');
    this.error.set(null);

    try {
      const base64String = await this.fileToBase64(file);
      const result = await this.ocrService.extractDataFromImage(base64String);
      this.ocrResult.set(result);
    } catch (err) {
      console.error('OCR process failed:', err);
      this.error.set('Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  saveData(): void {
    console.log('Dữ liệu đã lưu (mô phỏng):', this.ocrResult()?.extractedData);
    this.saveStatus.set('success');
    setTimeout(() => this.saveStatus.set('idle'), 3000);
  }
  
  reset(): void {
    this.selectedFile.set(null);
    this.imagePreviewUrl.set(null);
    this.ocrResult.set(null);
    this.isProcessing.set(false);
    this.saveStatus.set('idle');
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  }
}
