import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { WatchService } from '../services/watch.service';

@Component({
  selector: 'app-watches',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './watches.component.html',
})
export class WatchesComponent implements OnInit {
  watches: any[] = [];

  constructor(private watchService: WatchService) {}

  ngOnInit() {
    this.watchService.getWatches().subscribe(
      (data) => {
        this.watches = data.length > 0 ? data : this.getDefaultWatches();
      },
      (error) => {
        console.error('Error fetching watches:', error);
        this.watches = this.getDefaultWatches(); // Show default watches if API fails
      }
    );
  }

  private getDefaultWatches() {
    return [
      { brand: 'Rolex', model: 'Submariner', price: 12000, description: 'Luxury diving watch' },
      { brand: 'Casio', model: 'G-Shock', price: 150, description: 'Durable sports watch' },
      { brand: 'Omega', model: 'Speedmaster', price: 5000, description: 'Classic moonwatch' }
    ];
  }
}
