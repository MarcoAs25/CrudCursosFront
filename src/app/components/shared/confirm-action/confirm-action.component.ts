import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss'],
  imports: [MatButtonModule, MatDialogModule],
  standalone: true,
})
export class ConfirmActionComponent {
  op1 : string | undefined;
  op2 : string | undefined;
  actionText : string | undefined;
  color : string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any ,public dialogRef: MatDialogRef<ConfirmActionComponent>){
    this.op1 = data.op1;
    this.op2 = data.op2;
    this.actionText = data.actionText;
    this.color = data.color;
  }
  confirm(isOp2: boolean){
    this.dialogRef.close(isOp2);
  }
}
