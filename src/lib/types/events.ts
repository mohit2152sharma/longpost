export type Event<T, R> = {
	event_name: string;
	event_props: T;
	__identify?: R;
};

export type ButtonEventProps = {
	button_name: string;
	button_title?: string;
	button_page_name: string;
	button_page_url: string;
};

export type Identify = {
	profileId: string;
};

export type ButtonEvent = Event<ButtonEventProps, Identify>;
