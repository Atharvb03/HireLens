import pdf from 'pdf-parse'
import mammoth from 'mammoth'

/**
 * Extract text from different file types
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromFile(fileBuffer, mimeType) {
  try {
    if (mimeType === 'application/pdf') {
      return await extractTextFromPDF(fileBuffer)
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return await extractTextFromDOCX(fileBuffer)
    } else if (mimeType === 'text/plain') {
      return fileBuffer.toString('utf-8')
    } else {
      // Fallback: try to convert to string
      return fileBuffer.toString('utf-8')
    }
  } catch (error) {
    console.error('Error extracting text from file:', error)
    return ''
  }
}

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(fileBuffer) {
  try {
    const data = await pdf(fileBuffer)
    return data.text || ''
  } catch (error) {
    console.error('Error parsing PDF:', error)
    return ''
  }
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDOCX(fileBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer })
    return result.value || ''
  } catch (error) {
    console.error('Error parsing DOCX:', error)
    return ''
  }
}
