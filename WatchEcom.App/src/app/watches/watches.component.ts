import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Import CurrencyPipe
import { WatchService } from '../services/watch.service';

@Component({
  selector: 'app-watches',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], // Add CurrencyPipe
  templateUrl: './watches.component.html',
})
export class WatchesComponent implements OnInit {
  watches: any[] = [];

  constructor(private watchService: WatchService) {}

  ngOnInit() {
    this.watchService.getWatches().subscribe(data => {
      this.watches = data;
    });
  }
}
