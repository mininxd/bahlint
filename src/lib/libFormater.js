// lib.js
export function colorizeJS(code) {
	if (!code) return "";

	return (
		code
			// escape HTML first
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")

			// strings (yellow)
			.replace(
				/"([^"\\]*(\\.[^"\\]*)*)"/g,
				'<span class="text-yellow-400">"$1"</span>',
			)

			// keywords & brackets (pink)
			.replace(
				/\b(from|import|export|default)\b|\[|\]|,/g,
				'<span class="text-pink-400">$&</span>',
			)

			// curly braces (orange)
			.replace(/[{}]/g, '<span class="text-orange-400">$&</span>')
	);
}
