import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FullLayoutComponent, SimpleLayoutComponent} from '@kiwi-suite/ngx-admin';
import {PermissionGuard} from '@kiwi-suite/ngx-admin';

export const routes: Routes = [
    {
        path: '',
        component: SimpleLayoutComponent,
        children: [
            {
                path: '',
                component: FullLayoutComponent,
                // canActivateChild: [PermissionGuard],
                data: {
                    title: 'Home',
                },
                children: [
                    {
                        path: 'resource',
                        children: [
                            /**
                             * Resource routes
                             */
                            // {
                            //     path: 'category',
                            //     canLoad: [PermissionGuard],
                            //     data: {
                            //         title: 'Categories'
                            //     },
                            //     children: [
                            //         {
                            //             path: '',
                            //             component: CategoryListComponent,
                            //             data: {
                            //                 title: 'Categories',
                            //             },
                            //         },
                            //         {
                            //             path: 'create',
                            //             component: CategoryEditComponent,
                            //             data: {
                            //                 title: 'Category',
                            //                 action: 'create',
                            //             },
                            //         },
                            //         {
                            //             path: ':id/edit',
                            //             component: CategoryEditComponent,
                            //             data: {
                            //                 title: 'Category',
                            //                 action: 'edit',
                            //             },
                            //         },
                            //     ]
                            // },
                        ]
                    },
                ]
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [PermissionGuard]
})
export class AppRoutingModule {
}
