import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/Cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart.subscribe((c: Cart) => {
      this.cart = c;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckOut(): void {
    this.http
      .post('http://localhost:4242/checkout', {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          'pk_test_51Ls8ieAbI9DeXkEvitSLP1dcbmYStLyQOKkcWO8JqgQJgMYU2MolcAxVQQ4wIN1xCQfQqGzygrxfHl22cHX5TrUd00NUSHdZgP'
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
