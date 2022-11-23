import { ApiService } from './../services/api.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  freshnessList = ['Brand New', 'Second hand', 'Refusbished'];
  productForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogeRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
  }
  addProduct() {
    if (this.productForm.valid) {
      this.api.postProduct(this.productForm.value).subscribe({
        next: (res) => {
          alert('Product added succesfully');
          this.productForm.reset();          //For reseting the form after submission
          this.dialogeRef.close();          //For closing the form after submission
        },
        error: () => {
          alert('Error while adding the product');
        },
      });
    }
  }
  
}
