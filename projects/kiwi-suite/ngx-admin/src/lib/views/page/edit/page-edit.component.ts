import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewAbstractComponent } from '../../../components/view.abstract.component';
import { AppDataService } from '../../../services/data/app-data.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NotificationService } from '../../../services/notification.service';
import { SchemaTransformService } from '../../../services/schema-transform.service';

@Component({
  templateUrl: './page-edit.component.html',
})
export class PageEditComponent extends ViewAbstractComponent implements OnInit {

  versionData$: Promise<any>;
  data$: Promise<any>;

  id: string;

  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[];

  versionForm: FormGroup = new FormGroup({});
  versionFields: FormlyFieldConfig[];

  navigationForm: FormGroup = new FormGroup({});
  navigationModel: { navigation: Array<string> };
  navigationFields: FormlyFieldConfig[];

  navigationOptions: Array<any>;
  selectedNavigationOptions: Array<any>;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected appData: AppDataService,
              protected notification: NotificationService,
              protected schemaTransform: SchemaTransformService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.loadDetailData();
    });
  }

  private loadDetailData() {
    this.data$ = this.appData.getPageDetail(this.id).then((data) => {
      data.schema = this.schemaTransform.transformForm(data.schema);
      this.versionFields = data.schema ? data.schema : [];
      this.loadNavigationData(data.navigation);
      this.versionData$ = this.appData.getPageVersionDetail(this.id, data.page.version.head).then((versionData) => {
        return versionData;
      });
      return data;
    });
  }

  private loadNavigationData(navigation) {
    this.navigationOptions = navigation;
    this.selectedNavigationOptions = navigation.filter((element) => element.active).map((element) => element.name);
    console.log(this.navigationOptions, this.selectedNavigationOptions);
  }

  onReplaceContentModal(fromPage) {
    console.log(fromPage);
  }

  onSubmit(): void {
    if (this.form.valid === false) {
      this.notification.formErrors(this.form);
    } else {
      /*
      const data = this.form.getRawValue();
      /*
      data.locale = this.locale;
      data.parentSitemapId = this.parentSitemapId;
      this.appData.createResource('page', data).then((response) => {
        this.notification.success('Page successfully created', 'Success');
        this.router.navigateByUrl('/page/' + response.id + '/edit');
      }).catch((error) => this.notification.apiError(error));
      */
    }
  }
}



