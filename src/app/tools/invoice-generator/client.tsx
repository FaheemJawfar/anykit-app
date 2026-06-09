"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, Download, RotateCcw } from "lucide-react";

interface InvoiceItem { id: string; description: string; quantity: string; price: string; }

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{ id: "1", description: "", quantity: "1", price: "0" }]);
  const [tax, setTax] = useState("0");
  const [notes, setNotes] = useState("");

  const addItem = () => { setItems([...items, { id: Date.now().toString(), description: "", quantity: "1", price: "0" }]); };
  const removeItem = (id: string) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };
  const updateItem = (id: string, field: keyof InvoiceItem, value: string) => { setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item)); };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0), 0);
  const taxAmount = subtotal * (parseFloat(tax) || 0) / 100;
  const total = subtotal + taxAmount;

  const resetForm = () => { setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`); setInvoiceDate(new Date().toISOString().split("T")[0]); setDueDate(""); setFromName(""); setFromEmail(""); setFromAddress(""); setToName(""); setToEmail(""); setToAddress(""); setItems([{ id: "1", description: "", quantity: "1", price: "0" }]); setTax("0"); setNotes(""); };

  const generatePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [30, 64, 175];
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 25, { align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let yPos = 50;
    doc.setFont("helvetica", "bold"); doc.text("Invoice Number:", 15, yPos); doc.setFont("helvetica", "normal"); doc.text(invoiceNumber, 60, yPos);
    yPos += 7; doc.setFont("helvetica", "bold"); doc.text("Invoice Date:", 15, yPos); doc.setFont("helvetica", "normal"); doc.text(invoiceDate, 60, yPos);
    if (dueDate) { yPos += 7; doc.setFont("helvetica", "bold"); doc.text("Due Date:", 15, yPos); doc.setFont("helvetica", "normal"); doc.text(dueDate, 60, yPos); }
    yPos = 50; doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("From:", 120, yPos);
    yPos += 7; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    if (fromName) { doc.text(fromName, 120, yPos); yPos += 5; }
    if (fromEmail) { doc.text(fromEmail, 120, yPos); yPos += 5; }
    if (fromAddress) { const fromLines = doc.splitTextToSize(fromAddress, 75); doc.text(fromLines, 120, yPos); yPos += fromLines.length * 5; }
    yPos = Math.max(yPos, 85); doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Bill To:", 15, yPos);
    yPos += 7; doc.setFontSize(10); doc.setFont("helvetica", "normal");
    if (toName) { doc.text(toName, 15, yPos); yPos += 5; }
    if (toEmail) { doc.text(toEmail, 15, yPos); yPos += 5; }
    if (toAddress) { const toLines = doc.splitTextToSize(toAddress, 75); doc.text(toLines, 15, yPos); yPos += toLines.length * 5; }
    yPos = Math.max(yPos, 115);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]); doc.rect(15, yPos, 180, 8, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.text("Description", 17, yPos + 5.5); doc.text("Qty", 140, yPos + 5.5); doc.text("Price", 160, yPos + 5.5); doc.text("Amount", 180, yPos + 5.5);
    yPos += 8; doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "normal");
    items.forEach((item) => {
      const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
      yPos += 7;
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.text(item.description || "-", 17, yPos); doc.text((parseFloat(item.quantity) || 0).toString(), 140, yPos); doc.text(`$${(parseFloat(item.price) || 0).toFixed(2)}`, 160, yPos); doc.text(`$${amount.toFixed(2)}`, 180, yPos);
    });
    yPos += 15; if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setDrawColor(200, 200, 200); doc.line(15, yPos, 195, yPos); yPos += 10;
    doc.setFont("helvetica", "normal"); doc.text("Subtotal:", 145, yPos); doc.text(`$${subtotal.toFixed(2)}`, 180, yPos, { align: "right" });
    yPos += 7; doc.text(`Tax (${tax}%):`, 145, yPos); doc.text(`$${taxAmount.toFixed(2)}`, 180, yPos, { align: "right" });
    yPos += 10; doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Total:", 145, yPos); doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); doc.text(`$${total.toFixed(2)}`, 180, yPos, { align: "right" });
    if (notes) { yPos += 15; if (yPos > 260) { doc.addPage(); yPos = 20; } doc.setTextColor(0, 0, 0); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("Notes:", 15, yPos); yPos += 5; doc.setFont("helvetica", "normal"); const notesLines = doc.splitTextToSize(notes, 180); doc.text(notesLines, 15, yPos); }
    doc.save(`invoice-${invoiceNumber}.pdf`);
  };

  return (
    <ToolLayout toolId="invoice-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={generatePDF} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Download className="w-5 h-5 mr-2" /> Download as PDF</Button>
            <Button onClick={resetForm} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><RotateCcw className="w-4 h-4 mr-2" /> Reset Invoice</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Invoice Details</h3>
            <div className="space-y-3">
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Invoice Number</label><input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Invoice Date</label><input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Tax (%)</label><input type="number" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground font-medium"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-muted-foreground font-medium"><span>Tax ({tax}%)</span><span>${taxAmount.toFixed(2)}</span></div>
              <div className="pt-2 mt-2 border-t border-border flex justify-between items-center"><span className="font-black text-foreground">Total</span><span className="text-xl font-black text-primary">${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2"><div className="w-1.5 h-6 bg-primary rounded-full" /> Sender</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Your Name or Business Name" value={fromName} onChange={(e) => setFromName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" />
                <input type="email" placeholder="email@example.com" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" />
                <textarea placeholder="Address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card resize-none" />
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2"><div className="w-1.5 h-6 bg-primary rounded-full" /> Recipient</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Client Name" value={toName} onChange={(e) => setToName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" />
                <input type="email" placeholder="client@example.com" value={toEmail} onChange={(e) => setToEmail(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" />
                <textarea placeholder="Client Address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50"><h3 className="text-lg font-black text-foreground">Line Items</h3><Button onClick={addItem} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Item</Button></div>
            <div className="p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-2 text-xs font-black text-muted-foreground uppercase tracking-wider"><div className="col-span-6">Description</div><div className="col-span-2 text-center">Qty</div><div className="col-span-3 text-center">Price ($)</div><div className="col-span-1"></div></div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center group bg-muted/30 p-2 md:p-0 rounded-xl md:bg-transparent">
                    <div className="col-span-6"><input type="text" placeholder="Item Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
                    <div className="col-span-2"><input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card text-center" /></div>
                    <div className="col-span-3"><input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, "price", e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card text-center" /></div>
                    <div className="col-span-1 flex justify-end"><Button onClick={() => removeItem(item.id)} disabled={items.length === 1} variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2"><div className="w-1.5 h-6 bg-primary rounded-full" /> Notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Payment terms, bank details, or a thank you message..." className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card resize-none" />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
