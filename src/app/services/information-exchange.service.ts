import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformationExchangeService {
  executeFunction = new EventEmitter<void>();
  private dictionary: { [key: number]: boolean } = {};

  // Methode zum Hinzufügen eines Eintrags
  addEntry(key: number, value: boolean) {
    this.dictionary[key] = value;
  }

  // Methode zum Entfernen eines Eintrags
  removeEntry(key: number) {
    delete this.dictionary[key];
  }

  // Methode zum Abfragen des Wertes eines Eintrags
  getEntry(key: number): boolean | undefined {
    return this.dictionary[key];
  }

  // Optional: Methode zum Anzeigen des gesamten Dictionary
  getDictionary() {
    return this.dictionary;
  }

  removeAllEntries() {
    this.dictionary = {};
  }

  private tabIndexSource = new BehaviorSubject<number>(0);
  currentTab = this.tabIndexSource.asObservable();

  changeTab(index: number) {
    this.tabIndexSource.next(index);
  }
}
