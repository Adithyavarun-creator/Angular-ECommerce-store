import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/Cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  category: string | undefined;
  rowHeight = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productSubscription = this.storeService
      .getAllProducts(this.count, this.sort, this.category)
      .subscribe((product) => {
        this.products = product;
      });
  }

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    //calling all list of products
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    //calling all list of products
    this.getProducts();
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
