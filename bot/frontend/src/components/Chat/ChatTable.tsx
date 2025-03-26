import React, { useState } from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  DataTableHeader,
  DataTableRow,
  Modal,
  TextArea,
  InlineLoading,
} from "@carbon/react";
import { ReactComponent as OptionPopoverIcon } from "../../assets/images/option-popover.svg";
import { Popover, PopoverContent } from "@carbon/react/lib/components/Popover";
import { generateCareGapMessage } from "../../api/api";

interface ChatTablePropsType {
  header: NonNullable<React.ReactNode>[];
  keys: string[];
  data: {
    id: string;
    [key: string]: string;
  }[];
  feedback: boolean | null | undefined;
}

const ChatTable = (props: ChatTablePropsType) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 1000;

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeText, setNoticeText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const formatMessage = (message: string) => {
    const parts = message.replace(/^"|"$/g, "").split(/\n\n/);

    const salutation = parts.shift() || "";
    const signature = parts.pop() || "";
    const body = parts.join("\n\n");

    const signatureParts = signature.split(/,|\n/).map((s) => s.trim());
    const closing =
      signatureParts[0] === "Best regards" ? signatureParts.shift() : "";
    const name = signatureParts.shift() || "";
    const title = signatureParts.join(", ");

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p style="
          color: #525252;
          font-family: var(--FixedUtilityLabel0102Fontfamily);
          font-weight: 400;
          line-height: 18px;
          letter-spacing: 0.1599999964237213px;
          text-align: left;
          margin-bottom: 25px;
          margin-top: 10px;
        ">Subject: Next Steps for Your Health</p>
        <p style="margin-bottom: 10px;">${salutation}</p>
        <div style="margin-bottom: 20px;">
          ${body
            .split("\n\n")
            .map(
              (paragraph) => `<p style="margin-bottom: 10px;">${paragraph}</p>`
            )
            .join("")}
        </div>
        <p style="margin-bottom: 5px;">${closing}</p>
        <p style="margin-bottom: 5px;">${name}</p>
        ${title ? `<p>${title}</p>` : ""}
      </div>
    `;
  };

  /** Save the changes and hide the success message after 3 seconds */
  const handleModalEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      setIsEditing(true);
      setIsSaved(false);
    }
  };

  const handleGenerateAICareMessage = async (careGap: any) => {
    closePopover(careGap.id);
    setIsGenerating(true);
    setIsModalOpen(true);
    setNoticeText("Generating message...");
    setIsEditing(false);

    try {
      const message = await generateCareGapMessage({
        patient_id: careGap.patient_id,
        start_date: careGap.start_date,
        care_gap: careGap.care_gap,
        next_best_action: careGap.next_best_action,
        next_action_assignment: careGap.next_action_assignment,
      });
      const cleanedMessage = message
        .replace(/^"|"$/g, "")
        .replace(/^Here's a personalized message for Mr\. Doe:\s*\n*/i, "");

      setNoticeText(cleanedMessage);
    } catch (error) {
      console.error("Failed to generate AI care message:", error);
      setNoticeText("Failed to generate AI care message. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (isMessageSent) return;

    setIsSending(true);
    setSendError(false);
    setSendSuccess(false);

    let retries = 0;
    const attemptSend = async (): Promise<boolean> => {
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.3) {
              resolve(true);
            } else {
              reject(new Error("Failed to send message"));
            }
          }, 1000);
        });

        setIsSending(false);
        setSendSuccess(true);
        setIsMessageSent(true);
        
        setTimeout(() => {
          setIsModalOpen(false);
          setSendSuccess(false);
          setIsMessageSent(false);
        }, 1500);

        return true;
      } catch (error) {
        console.error(`Send attempt ${retries + 1} failed:`, error);
        
        if (retries < MAX_RETRIES) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return attemptSend();
        }
        
        setIsSending(false);
        setSendError(true);
        return false;
      }
    };

    await attemptSend();
  };

  const resetModalStates = () => {
    setIsSending(false);
    setSendSuccess(false);
    setSendError(false);
    setIsMessageSent(false);
    setIsEditing(false);
    setNoticeText("");
  };

  const togglePopover = (id: string) => {
    setOpenPopovers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const closePopover = (id: string) => {
    setOpenPopovers((prev) => ({ ...prev, [id]: false }));
  };

  const headers: DataTableHeader[] = [
    ...props.header.map((el, index) => ({
      header: el,
      key: props.keys[index],
    })),
    { header: "", key: "actions" },
  ];

  const rows: DataTableRow[] = props.data.map((row) => ({
    ...row,
    actions: (
      <Popover
        open={openPopovers[row.id] || false}
        align="bottom-right"
        className="chat__messages__item--popover"
      >
        <Button
          kind="ghost"
          hasIconOnly
          renderIcon={OptionPopoverIcon}
          iconDescription="Options"
          onClick={() => togglePopover(row.id)}
        />

        <PopoverContent>
          <div
            className="popover-button-container"
            onBlur={() => closePopover(row.id)}
          >
            <Button
              kind="ghost"
              onClick={() => handleGenerateAICareMessage(row)}
            >
              Generate Message
            </Button>
            <Button kind="ghost" onClick={() => {}}>
             Create Order
            </Button>
            <Button kind="ghost" onClick={() => {}}>
              Delete
            </Button>
            <Button kind="ghost" onClick={() => {}}>
              Edit
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    ),
  }));

  return (
    <>
      <DataTable
        rows={rows}
        headers={headers}
        render={({ rows, headers, getHeaderProps, getTableProps }) => (
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      />
      <Modal
        open={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          resetModalStates();
        }}
        modalHeading="Care Message"
        primaryButtonText={isSending ? "Sending..." : "Send"}
        secondaryButtonText="Cancel"
        onSecondarySubmit={() => {
          setIsModalOpen(false);
          resetModalStates();
        }}
        onRequestSubmit={handleSend}
        primaryButtonDisabled={isSending || isMessageSent}
      >
        <div className="modal-content">
          {isSending && (
            <InlineLoading 
              description="Sending message..." 
              status="active"
            />
          )}
          {sendSuccess && (
            <div className="success-message" style={{ color: "green", marginBottom: "1rem" }}>
              ✓ Care message sent successfully
            </div>
          )}
          {sendError && (
            <div className="error-message" style={{ color: "red", marginBottom: "1rem" }}>
              ⚠ Failed to send care message. Please try again.
            </div>
          )}
          {isGenerating ? (
            <InlineLoading 
              description="Generating AI care message..." 
              status="active"
            />
          ) : (
            <>
              {isEditing ? (
                <TextArea
                  labelText="Message Content"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="large-textarea"
                  disabled={isSending}
                />
              ) : (
                <div
                  className="message-preview"
                  dangerouslySetInnerHTML={{ __html: formatMessage(noticeText) }}
                />
              )}
              <div style={{ marginTop: "1rem" }}>
                <Button
                  kind="tertiary"
                  onClick={handleModalEdit}
                  disabled={isGenerating || isSending}
                >
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatTable;
