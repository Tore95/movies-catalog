import { Component, Inject, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize, map } from 'rxjs';
import { MovieResult } from '../services/interfaces';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel, DatePipe, RouterModule, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent],
})
export class HomePage {

  private movieServive = inject(MovieService);
  private currentPage = 1;
  protected error = null;
  protected isLoading = false;
  protected movies: MovieResult[] = [];
  protected dummyArray = new Array(20);
  public imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    
    if (!event) {
      this.isLoading = true;
    }

    this.movieServive.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();

        }
      }),
      catchError((err: any) => {
        console.error(err);
        this.error = err.error.status_message;
        return [];
      })
    ).subscribe({
      next: (res) => {
        this.movies.push(...res.results);
        this.currentPage++;

        if (event) {
          event.target.disabled = res.total_pages === this.currentPage;
        }
      }
    })
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
