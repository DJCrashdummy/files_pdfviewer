
/**
 * @copyright Copyright (c) 2020 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { generateUrl } from '@nextcloud/router'

const hideDownloadElmt = document.getElementById('hideDownload')
const isPublicElmt = document.getElementById('isPublic')
const mimetypeElmt = document.getElementById('mimetype')

const isSecureViewerAvailable = function() {
	return hideDownloadElmt && hideDownloadElmt.value === 'true' && typeof OCA.RichDocuments !== 'undefined'
}

window.addEventListener('DOMContentLoaded', function() {
	if (isPublicElmt && isPublicElmt.value && mimetypeElmt && mimetypeElmt.value === 'application/pdf' && !isSecureViewerAvailable()) {
		console.debug('Files_PDFViewer initiamized for public page')

		const page = location.hash.split('page=')[1] || 0
		const contentElmt = document.getElementById('files-public-content')
		const sharingTokenElmt = document.getElementById('sharingToken')
		const footerElmt = document.querySelector('#app-content > footer')

		const sharingToken = sharingTokenElmt.value
		const downloadUrl = generateUrl('/s/{token}/download', { token: sharingToken })
		const viewerUrl = generateUrl('/apps/files_pdfviewer/?file={downloadUrl}#page={page}', { downloadUrl, page })

		// Create viewer frame
		const viewerNode = document.createElement('iframe')
		viewerNode.src = viewerUrl
		viewerNode.style.height = '100%'
		viewerNode.style.width = '100%'
		viewerNode.style.position = 'absolute'

		// Inject viewer
		if (contentElmt) {
			contentElmt.innerHTML = ''
			contentElmt.appendChild(viewerNode)
			footerElmt.style.display = 'none'
		} else {
			console.error('Unable to inject the PDF Viewer')
		}
	}
})
