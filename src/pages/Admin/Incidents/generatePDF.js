import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import SiteImage from "../../../assets/images/Site.png";
import GLOBALS from "../../../globals";

const generatePDF = (tickets, companyName, sitedata, totalPrice) => {
  var today = moment(new Date()).format("DD/MM/YYYY");
  var newdate = "Date: " + today;

  var companyName = "Company : " + companyName;
  var siteName = "Site : " + sitedata?.name;
  var totalReinvoices = "" + tickets.length;

  var siteLogo = sitedata.logo
    ? GLOBALS.Constants.BASE_URL + sitedata?.logo
    : SiteImage;
  const doc = new jsPDF();
  const tableColumn = [
    "Name_of_Re-invoice",
    "Type_of_Re-invoice",
    "Date/Time",
    "Amount",
    "Status",
  ];
  const tableRows = [];

  console.log("tickets", tickets);
  tickets.forEach((ticket) => {
    const ticketData = [
      ticket.name,
      ticket.type,
      moment(ticket.date).format("DD/MM/YYYY HH:mm"),
      ticket.price,
      ticket.status,

      //   format(new Date(ticket.updated_at), "yyyy-MM-dd"),
    ];
    tableRows.push(ticketData);
  });
  // doc.text(145, 8, newdat);
  doc.setFont("", "bold");
  doc.text("Re-Invoice", 105, 10, null, null, "center");
  doc.text(newdate, 160, 25);
  // doc.text("Admin's client :  ", 14, 35);
  doc.addImage(siteLogo, "JPEG", 20, 20, 18, 18);
  doc.setFont("", "bold");
  doc.text(siteName, 75, 30, null, null, "right");
  doc.autoTable(tableColumn, tableRows, {
    startY: 50,
    theme: "grid",
    styles: {
      halign: "center",
    },
  });
  doc.setFontSize(10);
  // doc.text("Total Re-Invoicing : ", 185, 100, null, null, "right");

  // doc.text("Total Amount : ", 185, 105, null, null, "right");
  doc.setTextColor(255, 0, 0);
  // doc.text(totalReinvoices, 195, 100, null, null, "right");
  // doc.text(totalPrice, 195, 105, null, null, "right");
  const date = Date().split(" ");

  const dateStr = date[0] + "_" + date[1] + "_" + date[2];
  // doc.text("Hello downloaded the  tickets within the last one month.", 14, 30);
  doc.save(`invoice_of_${dateStr}.pdf`);
};

export default generatePDF;
