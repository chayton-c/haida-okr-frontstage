import { Component, Inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { TitleService } from '@delon/theme';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less', './login-opc.css'],
})
export class LayoutPassportComponent implements OnInit {
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];

  constructor(
    @Inject(DA_SERVICE_TOKEN)
    private tokenService: ITokenService,
    private titleService: TitleService,
  ) {}

  ngOnInit(): void {
    this.tokenService.clear();
    this.titleService.setTitle('登录');
  }
}
