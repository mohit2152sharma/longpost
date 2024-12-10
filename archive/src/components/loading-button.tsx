// Reference: https://github.com/de-mawo/rich-text-editor/blob/main/components/LoadingBtn.tsx
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading: boolean;
}

export default function LoadingBtn({ children, loading, ...props }: LoadingButtonProps) {
	return (
		<Button {...props} disabled={props.disabled || loading}>
			<span className="flex items-center justify-center gap-1">
				{loading && <Loader2 size={16} className="animate-spin" />}
				{children}
			</span>
		</Button>
	);
}
