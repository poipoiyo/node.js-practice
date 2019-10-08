const deleteAccount = (btn) => {
	const name = btn.parentNode.querySelector('[name=name]').value;
	const accouId = btn.parentNode.querySelector('[name=accountId]').value;
	const csrf = btn.parentNode.querySelector('[name=_csrf').value;
	
	const accountElement = btn.closest('article');
	
	fetch('/admin/account/' + accouId, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrf
		}
	}).then(result => {
		return result.json();
	}).then(data => {
		console.log(data);
		accountElement.parentNode.removeChild(accountElement);
	})
	.catch(err => console.log(err));
};