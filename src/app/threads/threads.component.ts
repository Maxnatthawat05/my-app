import { Component } from '@angular/core';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.css']
})
export class ThreadsComponent {
  threads = [
    { name: 'ดูหนังแล้วหลับตาได้มั้ย' },
    { name: 'หนังผีอะไรน่ารัก' },
    { name: 'หนังที่ต่อสู้แล้วพระเอกแพ้' },
  ];

  goBack() {
    // Implement navigation logic here
    console.log('Go back to previous page');
  }

  addCategory() {
    // Logic to add a new category
    console.log('Add new category');
  }

  editThread(thread: any) {
    // Logic to edit the selected thread
    console.log('Edit thread:', thread.name);
  }

  deleteThread(thread: any) {
    // Logic to delete the selected thread
    console.log('Delete thread:', thread.name);
    this.threads = this.threads.filter(t => t !== thread);
  }
}
