import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditReport, Severity } from '../types';

export const generatePDF = (report: AuditReport) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  let yPos = 20;

  // Helper to check page break
  const checkPageBreak = (heightNeeded: number) => {
    if (yPos + heightNeeded > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // --- Header ---
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("AuditGPT Security Report", margin, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(`Generated on ${new Date(report.auditDate).toLocaleDateString()} ${new Date(report.auditDate).toLocaleTimeString()}`, margin, 30);
  
  // Score Badge in Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.text(`${report.overallScore}`, pageWidth - margin - 25, 28, { align: 'right' });
  doc.setFontSize(10);
  doc.text("/ 100", pageWidth - margin, 28, { align: 'right' });

  yPos = 55;

  // --- Contract Info ---
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Contract Details", margin, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${report.contractName}`, margin, yPos);
  yPos += 7;
  doc.text(`Network: Polygon PoS Mainnet`, margin, yPos);
  if (report.contractAddress) {
    yPos += 7;
    doc.text(`Address: ${report.contractAddress}`, margin, yPos);
  }
  
  // --- Executive Summary ---
  yPos += 15;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", margin, yPos);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // Slate 600
  
  const splitSummary = doc.splitTextToSize(report.summary, pageWidth - (margin * 2));
  doc.text(splitSummary, margin, yPos);
  yPos += (splitSummary.length * 6) + 10;

  // --- Vulnerability Statistics ---
  const stats = [
    { severity: Severity.HIGH, count: report.vulnerabilities.filter(v => v.severity === Severity.HIGH).length, color: [239, 68, 68] },
    { severity: Severity.MEDIUM, count: report.vulnerabilities.filter(v => v.severity === Severity.MEDIUM).length, color: [249, 115, 22] },
    { severity: Severity.LOW, count: report.vulnerabilities.filter(v => v.severity === Severity.LOW).length, color: [234, 179, 8] },
    { severity: Severity.INFO, count: report.vulnerabilities.filter(v => v.severity === Severity.INFO).length, color: [59, 130, 246] },
  ];

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("Vulnerability Overview", margin, yPos);
  yPos += 10;

  let xPos = margin;
  stats.forEach(stat => {
    if (stat.count > 0) {
      // FIX: Explicitly pass arguments instead of spread to satisfy TypeScript tuple requirements
      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.rect(xPos, yPos - 5, 40, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${stat.severity}: ${stat.count}`, xPos + 20, yPos + 1, { align: 'center' });
      xPos += 45;
    }
  });
  
  yPos += 20;

  // --- Detailed Findings Table ---
  if (report.vulnerabilities.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("Detailed Security Findings", margin, yPos);
    yPos += 5;

    const tableData = report.vulnerabilities.map(v => [
      v.severity,
      v.title,
      `Line ${v.lineNumber}`,
      v.id
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Severity', 'Title', 'Location', 'ID']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold' }
      },
      didParseCell: function(data) {
          if (data.section === 'body' && data.column.index === 0) {
              const severity = data.cell.raw;
              if (severity === Severity.HIGH) data.cell.styles.textColor = [220, 38, 38];
              if (severity === Severity.MEDIUM) data.cell.styles.textColor = [234, 88, 12];
              if (severity === Severity.LOW) data.cell.styles.textColor = [202, 138, 4];
              if (severity === Severity.INFO) data.cell.styles.textColor = [37, 99, 235];
          }
      }
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 15;

    // --- Detailed Descriptions (Security) ---
    report.vulnerabilities.forEach((vuln, index) => {
      checkPageBreak(60);

      doc.setFillColor(241, 245, 249); // Slate 100
      doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(`#${index + 1} - ${vuln.title} (${vuln.id})`, margin + 2, yPos + 7);

      // Confidence Badge
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Confidence: ${vuln.confidence}`, pageWidth - margin - 2, yPos + 7, { align: 'right' });
      
      yPos += 15;

      // Impact Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      doc.text("Impact:", margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      const impact = doc.splitTextToSize(vuln.impact, pageWidth - (margin * 2));
      doc.text(impact, margin, yPos);
      yPos += (impact.length * 5) + 5;
      
      // Description
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.text("Description:", margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      const desc = doc.splitTextToSize(vuln.description, pageWidth - (margin * 2));
      doc.text(desc, margin, yPos);
      yPos += (desc.length * 5) + 5;

      // Remediation
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.text("Remediation:", margin, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      const rem = doc.splitTextToSize(vuln.remediation, pageWidth - (margin * 2));
      doc.text(rem, margin, yPos);
      yPos += (rem.length * 5) + 5;

      // Code Fix Snippet
      if (vuln.codeFix) {
        checkPageBreak(40);
        doc.setFont("helvetica", "bold");
        doc.text("Suggested Fix:", margin, yPos);
        yPos += 5;
        
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        const code = doc.splitTextToSize(vuln.codeFix, pageWidth - (margin * 2) - 4);
        
        // Background for code
        const boxHeight = (code.length * 5) + 6;
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.rect(margin, yPos, pageWidth - (margin * 2), boxHeight, 'FD');

        doc.setTextColor(22, 163, 74); // Green 600
        doc.text(code, margin + 2, yPos + 5);
        yPos += boxHeight + 10;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
      }
      
      yPos += 5; // Spacing between items
    });
  }

  // --- Upgradeability Analysis Section ---
  if (report.upgradeabilityAnalysis && report.upgradeabilityAnalysis.length > 0) {
    checkPageBreak(50);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("Upgradeability & Proxy Analysis", margin, yPos);
    yPos += 10;

    report.upgradeabilityAnalysis.forEach((item, index) => {
      checkPageBreak(40);
      
      // Box style
      doc.setDrawColor(168, 85, 247); // Purple 500
      doc.setFillColor(250, 245, 255); // Purple 50
      doc.rect(margin, yPos, pageWidth - (margin * 2), 25, 'FD');
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(147, 51, 234); // Purple 600
      doc.text(`${item.type}`, margin + 3, yPos + 8);

      // Severity Badge
      doc.setFontSize(10);
      doc.text(`Severity: ${item.severity}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });

      yPos += 15;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85); // Slate 700
      const desc = doc.splitTextToSize(item.description, pageWidth - (margin * 4));
      doc.text(desc, margin + 3, yPos);
      
      yPos += 15;
    });
    
    yPos += 5;
  }

  // --- Gas Optimization Section ---
  if (report.gasAnalysis.length > 0) {
    checkPageBreak(50);
    yPos += 10;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("Gas Optimization Report", margin, yPos);
    yPos += 10;

    report.gasAnalysis.forEach((item, index) => {
      checkPageBreak(50);

      // Header Bar - Taller to prevent text overlap (stacked layout)
      doc.setFillColor(240, 253, 244); // Green 50
      doc.setDrawColor(22, 163, 74); // Green 600
      doc.rect(margin, yPos, pageWidth - (margin * 2), 18, 'FD');

      // Title Line
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 128, 61); // Green 700
      doc.text(`Optimization #${index + 1}: ${item.category}`, margin + 3, yPos + 6);
      
      // Savings Line (Stacked below title)
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(22, 101, 52); // Darker Green
      const savingsText = item.potentialSavings.toLowerCase().startsWith('savings') 
        ? item.potentialSavings 
        : `Savings: ${item.potentialSavings}`;
      doc.text(savingsText, margin + 3, yPos + 13);
      
      yPos += 25;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85); // Slate 700
      const desc = doc.splitTextToSize(item.description, pageWidth - (margin * 2));
      doc.text(desc, margin, yPos);
      yPos += (desc.length * 5) + 5;

      // Snippet with formatting
      if (item.codeSnippet) {
        checkPageBreak(30);
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        
        const code = doc.splitTextToSize(item.codeSnippet, pageWidth - (margin * 2) - 4);
        
        // Background for code
        const boxHeight = (code.length * 5) + 6;
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.rect(margin, yPos, pageWidth - (margin * 2), boxHeight, 'FD');

        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text(code, margin + 2, yPos + 5);
        yPos += boxHeight + 10;
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(51, 65, 85);
      } else {
        yPos += 5;
      }
    });
  }

  // --- Economic Security Section ---
  if (report.economicAnalysis.length > 0) {
    checkPageBreak(50);
    yPos += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("Economic Security Analysis", margin, yPos);
    yPos += 10;

    report.economicAnalysis.forEach((risk, index) => {
      checkPageBreak(50);

      // Header Bar
      let headerColor = [241, 245, 249]; // Slate 100
      let textColor = [51, 65, 85]; // Slate 700
      
      if (risk.riskLevel === Severity.HIGH) {
        headerColor = [254, 242, 242]; // Red 50
        textColor = [185, 28, 28]; // Red 700
      } else if (risk.riskLevel === Severity.MEDIUM) {
        headerColor = [255, 247, 237]; // Orange 50
        textColor = [194, 65, 12]; // Orange 700
      }

      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
      doc.rect(margin, yPos, pageWidth - (margin * 2), 12, 'F');

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(`${risk.vector} (${risk.riskLevel})`, margin + 3, yPos + 8);

      yPos += 18;

      // Scenario
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 65, 85);
      doc.text("Attack Scenario:", margin, yPos);
      yPos += 5;
      
      doc.setFont("helvetica", "normal");
      const scenario = doc.splitTextToSize(risk.scenario, pageWidth - (margin * 2));
      doc.text(scenario, margin, yPos);
      yPos += (scenario.length * 5) + 5;

      // Mitigation
      checkPageBreak(30);
      doc.setFont("helvetica", "bold");
      doc.text("Mitigation Strategy:", margin, yPos);
      yPos += 5;
      
      doc.setFont("helvetica", "normal");
      const mitigation = doc.splitTextToSize(risk.mitigation, pageWidth - (margin * 2));
      doc.text(mitigation, margin, yPos);
      yPos += (mitigation.length * 5) + 10;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Page ' + i + ' of ' + pageCount, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Powered by AuditGPT', margin, pageHeight - 10);
  }

  doc.save(`AuditGPT_Report_${report.contractName.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.pdf`);
};