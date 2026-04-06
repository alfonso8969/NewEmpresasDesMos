import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/users';
import { Email } from '../interfaces/email';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private urlEmail: string;
  private urlPHPCustomEmail: string;
  private baseUrl: string;
  private dbName = 'EmailsBackupDB';
  private storeName = 'emails';

  constructor(private http: HttpClient) {
    this.urlEmail = environment.urlPHPEmail;
    this.urlPHPCustomEmail = environment.urlPHPCustomEmail;
    this.baseUrl = environment.apiUrl;
    this.initIndexedDB();
  }

  private initIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // MÉTODO PARA GUARDAR (setItem)
  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      if (
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.warn('LocalStorage lleno, reintentando en IndexedDB...');
        await this.setIDB(key, value);
      } else {
        throw e;
      }
    }
  }

  // MÉTODO PARA LEER (getItem)
  async getItem(key: string): Promise<string | null> {
    // 1. Intentar LocalStorage (Síncrono)
    const localData = localStorage.getItem(key);
    if (localData !== null) return localData;

    // 2. Si no está, buscar en IndexedDB (Asíncrono)
    return await this.getIDB(key);
  }

  // Métodos privados para IndexedDB
  private async setIDB(key: string, value: string): Promise<void> {
    const db = await this.initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getIDB(key: string): Promise<string | null> {
    const db = await this.initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  sendCustomEmail(data: any): Observable<any> {
    const options = new HttpHeaders().set(
      'Content-Type',
      'Content-Type:text/plain; charset=UTF-8',
    );
    return this.http.post(this.urlPHPCustomEmail, data, { headers: options });
  }

  sendEmail(data: any): Observable<any> {
    const options = new HttpHeaders().set(
      'Content-Type',
      'Content-Type:text/plain; charset=UTF-8',
    );
    return this.http.post(this.urlEmail, data, { headers: options });
  }

  public checkEmail(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/checkEmail.php`, {
      user: user,
    });
  }

  /**
   * Función que recoge los emails recibidos, lo hace a través de imap
   *
   * @return {Observable<Email[]>} Un observer de Array de Emails
   */
  public getEmails(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.baseUrl}/getEmails.php`);
  }

  /**
   * Función que recoge los emails enviados, lo hace a través de la BBDD
   *
   * @return {Observable<Email[]>} Un observer de Array de Emails
   */
  public getEmailsResponse(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.baseUrl}/getEmailsResponse.php`);
  }
}
