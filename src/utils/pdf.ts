import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Organisation, Transaction, Receipt, PaymentRequest } from '../types';

// numberToWords is implemented below as numberToWordsSafe

// Re-implement without mutation
function numberToWordsSafe(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertLessThanThousand(n: number): string {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n = n % 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n = n % 10;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  }
  
  let intPart = Math.floor(num);
  const paisa = Math.round((num - Math.floor(num)) * 100);
  
  let words = '';
  
  if (intPart >= 10000000) {
    words += convertLessThanThousand(Math.floor(intPart / 10000000)) + 'Crore ';
    intPart = intPart % 10000000;
  }
  if (intPart >= 100000) {
    words += convertLessThanThousand(Math.floor(intPart / 100000)) + 'Lakh ';
    intPart = intPart % 100000;
  }
  if (intPart >= 1000) {
    words += convertLessThanThousand(Math.floor(intPart / 1000)) + 'Thousand ';
    intPart = intPart % 1000;
  }
  if (intPart > 0) {
    words += convertLessThanThousand(intPart);
  }
  
  words = words.trim() + ' Rupees';
  if (paisa > 0) {
    words += ' and ' + convertLessThanThousand(paisa).trim() + ' Paise';
  }
  words += ' Only';
  
  return words;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function generateReceiptPDF(
  org: Organisation,
  transaction: Transaction,
  receipt: Receipt,
  paymentRequest?: PaymentRequest
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Demo watermark
  if (receipt.isDemo || transaction.isDemo) {
    doc.setFontSize(10);
    doc.setTextColor(220, 50, 50);
    doc.text('DEMO RECEIPT — NOT PROOF OF PAYMENT', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setTextColor(0, 0, 0);
  }

  // Organisation header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(org.name, pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const addressLine = [org.address, org.city, org.state, org.pinCode].filter(Boolean).join(', ');
  doc.text(addressLine, pageWidth / 2, y, { align: 'center' });
  y += 5;
  const contactLine = [org.email, org.phone].filter(Boolean).join(' | ');
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setTextColor(0, 0, 0);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Receipt title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Receipt details - two columns
  const col1X = margin;
  const col2X = pageWidth / 2 + 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);

  // Left column
  doc.text('Receipt No:', col1X, y);
  doc.text('Issue Date:', col1X, y + 5);
  doc.text('Payment Date:', col1X, y + 10);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(receipt.receiptNumber, col1X + 25, y);
  doc.text(formatDate(receipt.createdAt), col1X + 25, y + 5);
  doc.text(transaction.paidAt ? formatDateTime(transaction.paidAt) : formatDateTime(transaction.createdAt), col1X + 25, y + 10);

  // Right column
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Status:', col2X, y);
  doc.text('Method:', col2X, y + 5);
  doc.text('Transaction Ref:', col2X, y + 10);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(transaction.status.toUpperCase(), col2X + 28, y);
  doc.text((transaction.method || 'N/A').toUpperCase(), col2X + 28, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(transaction.providerRef || transaction.id, col2X + 28, y + 10);

  y += 22;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Customer details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Received From:', margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.text(transaction.customerName || paymentRequest?.customerName || 'N/A', margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  if (transaction.customerEmail) {
    doc.text(`Email: ${transaction.customerEmail}`, margin, y);
    y += 4;
  }
  if (transaction.customerRef) {
    doc.text(`Reference: ${transaction.customerRef}`, margin, y);
    y += 4;
  }
  y += 4;

  doc.setTextColor(0, 0, 0);

  // Payment description table
  const title = paymentRequest?.title || transaction.description || 'Payment';
  const amount = transaction.amount;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Description', 'Amount']],
    body: [[title, formatCurrency(amount)]],
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], fontSize: 9 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: 'right' } },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Paid:', pageWidth - margin - 50, y);
  doc.text(formatCurrency(amount), pageWidth - margin, y, { align: 'right' });
  y += 8;

  // Amount in words
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Amount in words:', margin, y);
  y += 5;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'italic');
  const wordsText = numberToWordsSafe(amount);
  const splitWords = doc.splitTextToSize(wordsText, contentWidth);
  doc.text(splitWords, margin, y);
  y += splitWords.length * 4 + 8;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);

  if (receipt.isDemo || transaction.isDemo) {
    doc.setTextColor(220, 50, 50);
    doc.text('This is a DEMO receipt. No actual payment has been processed.', pageWidth / 2, y, { align: 'center' });
    y += 5;
    doc.setTextColor(120, 120, 120);
  }

  doc.text('This is a computer-generated receipt.', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.text(`Generated by PayX on ${formatDateTime(new Date().toISOString())}`, pageWidth / 2, y, { align: 'center' });

  return doc;
}

export function downloadReceiptPDF(
  org: Organisation,
  transaction: Transaction,
  receipt: Receipt,
  paymentRequest?: PaymentRequest
): void {
  const doc = generateReceiptPDF(org, transaction, receipt, paymentRequest);
  const filename = `Receipt_${receipt.receiptNumber}.pdf`;
  doc.save(filename);
}

export { formatCurrency, formatDate, formatDateTime, numberToWordsSafe as numberToWords };
