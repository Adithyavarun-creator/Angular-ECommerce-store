import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/Cart.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find((i) => i.id === item.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }
    this.cart.next({ items: items });
    this._snackBar.open('1 item added to cart', 'ok', { duration: 3000 });
    console.log(this.cart.value);
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, curr) => prev + curr, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared', 'ok', { duration: 3000 });
  }

  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter((i) => i.id !== item.id);
    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart', 'ok', { duration: 3000 });
    }
    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;
    let removalItems = this.cart.value.items.map((i) => {
      if (i.id === item.id) {
        i.quantity--;
        if (i.quantity === 0) {
          itemForRemoval = i;
        }
      }
      return i;
    });
    if (itemForRemoval) {
      removalItems = this.removeFromCart(itemForRemoval);
    }
    this.cart.next({ items: removalItems });
    this._snackBar.open('1 item removed from cart', 'ok', { duration: 3000 });
  }
}
