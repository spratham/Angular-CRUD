import { ApiService } from './services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'AngularCRUD';
  displayedColumns: string[] = [
    'productName',
    'category',
    'freshness',
    'date',
    'price',
    'comment',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private api: ApiService) {}
  ngOnInit() {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
      })
      .afterClosed() //to render the table on adding new product
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }
  getAllProducts() {
    return this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res); //putting response in our table datascource
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error while fetching the records');
      },
    });
  }
  editProduct(
    row: any //passing row values
  ) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row, //our DialogComponent will have the data of ROW
      })
      .afterClosed()
      //to render the table on adding new product
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        alert('Product is deleted successfully');
        this.getAllProducts();
      },
      error: () => {
        alert('Error while deleting the product');
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
