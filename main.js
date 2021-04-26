const core = require('@actions/core');
const fetch = require('node-fetch');

let registryUrl = core.getInput('registryUrl');
let owner = core.getInput('owner');
let repo = core.getInput('repo');
let tag = core.getInput('tag');

function processDelete(callback) {

	fetch(registryUrl + '/v2/' + owner + '/' + repo + '/manifests/' + tag,{
		method: "GET",
		headers: { 'Accept': 'application/vnd.docker.distribution.manifest.v2+json'}
	})
		.then(async(response) => {
			if (response.ok) {
				digest = await response.headers.get('docker-content-digest');
				callback(digest);
			}
			else {
				throw new Error(response.status + " Fetch failed");
			}
		}).catch(e => console.error('EXCEPTION: ', e))
}

function deleteManifest(digest) {

	fetch(registryUrl + '/v2/' + owner + '/' + repo + '/manifests/' + digest,{
		method: "DELETE",
		headers: { 'Accept': 'application/vnd.docker.distribution.manifest.v2+json'}
	})
		.then(async(response) => {
			if ( ! response.ok) {
				throw new Error(response.status + " Delete failed");
			}

			console.log(digest + ' deleted');

		}).catch(e => console.error('EXCEPTION: ', e))
}

processDelete(digest => deleteManifest(digest));
