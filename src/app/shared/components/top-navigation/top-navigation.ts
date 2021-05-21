import { Component, ComponentFactoryResolver, ElementRef, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MenuService, SettingsService } from '@delon/theme';
import { Menu } from '@delon/theme/src/services/menu/interface';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.html',
  styleUrls: ['./top_navigation.css'],
})
export class TopNavigation {
  isSelected = false;

  constructor(private router: Router, private menuService: MenuService) {}
  hideTopNavigation = false;

  get menus(): Menu[] {
    return this.menuService.menus;
  }

  hideSiblingsAndSelect(menu: Menu): void {
    this.isSelected = false;
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
  setSelect() {
    this.isSelected = true;
  }

  ngOnInit(): void {
    this.hideTopNavigation = this.router.url == '/center-screen/screen';
  }
  openCenterScreen() {
    window.open('/#/center-screen/screen', '_blank');
  }
}
