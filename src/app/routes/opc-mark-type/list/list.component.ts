import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';

export interface Node {
  title: string;
  value: string;
  key: string;
  type: string;
  checked?: boolean;
  isLeaf?: boolean;
  children?: Node[];
}

@Component({
  selector: 'app-opc-mark-type-list',
  templateUrl: './list.component.html',
})
export class OpcMarkTypeListComponent implements OnInit {
  ngOnInit(): void {
    // 加载菜单信息
    this.nodes.forEach((node) => this.getChildren(node));
  }

  value: string[] = ['0-0-0'];
  nodes: Node[] = [
    {
      title: 'Node1',
      value: 'a',
      key: 'a',
      type: 'parent',
      children: [
        {
          title: 'Child Node1',
          type: 'children',
          value: '0-0-0',
          key: '0-0-0',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'Node2',
      value: 'b',
      key: 'b',
      type: 'parent',
      children: [
        {
          title: 'Child Node3',
          value: '0-1-0',
          type: 'children',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
          type: 'children',
          isLeaf: true,
        },
        {
          title: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
          type: 'children',
          isLeaf: true,
        },
      ],
    },
  ];

  onChange($event: string[]): void {
    console.log();
    this.nodes.forEach((node) => this.getChildren(node));
  }

  getChildren(node: Node): void {
    if (node.type == 'children' && node.checked) {
      console.log(node.key);
      return;
    }

    if (node.children) node.children.forEach((child) => this.getChildren(child));
  }
}
