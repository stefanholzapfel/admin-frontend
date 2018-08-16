import { Injectable } from '@angular/core';
import { DataServiceAbstract } from './data.service.abstract';
import { ApiService } from '../api.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { DefaultStore } from '../../store/default.store';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interfaces/user.interface';
import { ConfigService } from '../config.service';
import { tap } from 'rxjs/internal/operators';

@Injectable()
export class AccountDataService extends DataServiceAbstract {

  user$: Observable<User>;

  constructor(protected api: ApiService, protected config: ConfigService, protected store: Store<AppState>) {
    super(store);

    this.store.addReducer('user', DefaultStore.Handle('USER'));

    this.user$ = this.loadFromStore('user', this.loadUser).pipe(tap((user) => {
      this.config.setUserPermissions(user ? user.permissions : null);
    }));
  }

  loadUser(): Promise<any> {
    return this.api.get(this.config.appConfig.routes.authUser).then((data: any) => {
      this.saveToDefaultStore('USER', data);
    });
  }

  updateEmail(email: string, emailRepeat: string) {
    return this.api.patch(this.config.appConfig.routes.accountEmail, {email, emailRepeat});
  }

  updatePassword(passwordOld: string, password: string, passwordRepeat: string) {
    return this.api.patch(this.config.appConfig.routes.accountPassword, {passwordOld, password, passwordRepeat});
  }

  login(email: string, password: string) {
    return this.api.post(this.config.appConfig.routes.authLogin, {email, password});
  }

  logout() {
    return this.api.post(this.config.appConfig.routes.authLogout);
  }

}
