import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { appIcons } from '../resources/appIcons';

@Directive({
  	selector: '[appIcon]'
})
export class AppIconDirective implements OnChanges {
	@Input('appIcon') iconName?: string;

	constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

	ngOnChanges(_changes: SimpleChanges): void {
		this.updateIcon();
	}

	private updateIcon(): void {
		const host = this.el.nativeElement;
		this.renderer.setProperty(host, 'innerHTML', '');
		if (!this.iconName) {
		this.renderer.removeClass(host, 'icon');
		return;
		}

		const svg = appIcons[this.iconName];
		this.renderer.setProperty(host, 'innerHTML', svg);
		this.renderer.addClass(host, 'icon');
	}
}
