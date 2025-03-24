export type Event<T> = {
	event_name: string;
	event_props: T;
};

export type ButtonEventProps = {
	button_name: string;
	button_title?: string;
	button_page_name: string;
	button_page_url: string;
};

export type ButtonEvent = Event<ButtonEventProps>;
