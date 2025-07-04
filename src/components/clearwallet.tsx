import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface ClearWalletsDialogProps {
	onConfirm: () => void;
	children: React.ReactNode;
}

const ClearWalletsDialog: React.FC<ClearWalletsDialogProps> = ({
	onConfirm,
	children,
}) => {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
				<AlertDialog.Content className="fixed left-1/2 top-1/2 max-w-sm mx-4 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 sm:p-6 shadow-lg z-50">
					<AlertDialog.Title className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
						Clear All Wallets?
					</AlertDialog.Title>
					<AlertDialog.Description className="text-sm text-gray-600 mb-4">
						This action cannot be undone. This will permanently delete all your
						wallets and remove all wallet data from your browser.
					</AlertDialog.Description>
					<div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
						<AlertDialog.Cancel asChild>
							<button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
								Cancel
							</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<button
								onClick={onConfirm}
								className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Clear All
							</button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};

export default ClearWalletsDialog;
