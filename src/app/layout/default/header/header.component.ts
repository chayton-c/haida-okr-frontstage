import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { App, MenuService, SettingsService } from '@delon/theme';
import { Menu } from '@delon/theme/src/services/menu/interface';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchToggleStatus = false;

  constructor(private settings: SettingsService, private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {}

  get app(): App {
    return this.settings.app;
  }

  get menus(): Menu[] {
    return this.menuService.menus;
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  toggleCollapsedSidebar(): void {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange(): void {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  hideSiblingsAndSelect(menu: Menu): void {
    const menuList = this.menuService.menus;
    menuList.forEach((value) => {
      value.hide = true;
      value.open = false;
      value._selected = false;
      value.group = false;
    });
    menu.hide = false;
    menu.open = true;
    menu._selected = true;
    this.menuService.resume();

    if (menu.link != '-1') this.router.navigate([menu.link]);
  }
}
