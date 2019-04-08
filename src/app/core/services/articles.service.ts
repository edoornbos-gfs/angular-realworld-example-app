import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { ApiService } from './api.service';
import { Article, ArticleListConfig } from '../models';
import { map } from 'rxjs/operators';
import { SessionSet } from '../models';


@Injectable()
export class ArticlesService {

  public sessionSet = new BehaviorSubject<SessionSet>({} as SessionSet);

  constructor (
    private apiService: ApiService
  ) {
    this.sessionSet.next({articleIds: new Set<String>()});
  }

  query(config: ArticleListConfig): Observable<{articles: Article[], articlesCount: number}> {
    // Convert any filters over to Angular's URLSearchParams
    const params = {};

    Object.keys(config.filters)
    .forEach((key) => {
      params[key] = config.filters[key];
    });

    return this.apiService
    .get(
      '/articles' + ((config.type === 'feed') ? '/feed' : ''),
      new HttpParams({ fromObject: params })
    );
  }

  get(slug): Observable<Article> {
    this.sessionSet.next({articleIds: new Set<String>(this.sessionSet.value.articleIds)})
    return this.apiService.get('/articles/' + slug)
      .pipe(map(data => data.article));
  }

  destroy(slug) {
    return this.apiService.delete('/articles/' + slug);
  }

  save(article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.apiService.put('/articles/' + article.slug, {article: article})
        .pipe(map(data => data.article));

    // Otherwise, create a new article
    } else {
      return this.apiService.post('/articles/', {article: article})
        .pipe(map(data => data.article));
    }
  }

  favorite(slug): Observable<Article> {
    return this.apiService.post('/articles/' + slug + '/favorite');
  }

  unfavorite(slug): Observable<Article> {
    return this.apiService.delete('/articles/' + slug + '/favorite');
  }

  addToSessionSet(slug) {
    return this.sessionSet.next({
      articleIds: new Set<String>(this.sessionSet.value.articleIds).add(slug)});
  }
}
