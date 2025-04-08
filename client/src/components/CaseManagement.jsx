// src/pages/CasesPage.jsx
import { useState } from "react";
import { caseManagement, crimeReports } from "@/./utils/dumm-data.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "../components/ui/progress";
import {
  ArrowRight,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  User,
} from "lucide-react";

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);

  const itemsPerPage = 5;

  // Apply filters
  const filteredCases = caseManagement.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || caseItem.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || caseItem.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Paginate
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const getCrimeReportById = (id) => {
    return crimeReports.find((report) => report.id === id);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Case Management</h1>
          <p className="text-muted-foreground">
            Track and manage ongoing investigations
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Create Case
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="p-4">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <TabsList>
                    <TabsTrigger value="all">All Cases</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="closed">Closed</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search cases..."
                        className="w-full pl-8 md:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <div className="p-2">
                          <p className="mb-1 text-sm font-medium">Status</p>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>

                          <p className="mt-3 mb-1 text-sm font-medium">
                            Priority
                          </p>
                          <Select
                            value={priorityFilter}
                            onValueChange={setPriorityFilter}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Priorities
                              </SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCases.length > 0 ? (
                    currentCases.map((caseItem) => (
                      <TableRow
                        key={caseItem.id}
                        onClick={() => handleCaseClick(caseItem)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {caseItem.id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{caseItem.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Opened: {caseItem.dateOpened}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`
                            inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold
                            ${
                              caseItem.status === "Active"
                                ? "border-green-600/20 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-950 dark:text-green-400"
                                : "border-gray-600/20 bg-gray-50 text-gray-700 dark:border-gray-500/20 dark:bg-gray-950 dark:text-gray-400"
                            }
                          `}
                          >
                            {caseItem.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`
                            inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                            ${
                              caseItem.priority === "Critical"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : caseItem.priority === "High"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                : caseItem.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }
                          `}
                          >
                            {caseItem.priority}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span>{caseItem.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={caseItem.progress}
                              className="h-2"
                            />
                            <span className="text-xs">
                              {caseItem.progress}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>
                                Update progress
                              </DropdownMenuItem>
                              <DropdownMenuItem>Reassign case</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {caseItem.status === "Active" ? (
                                <DropdownMenuItem>Close case</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Reopen case</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No cases found matching the criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4">
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(indexOfFirstItem + 1, filteredCases.length)}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredCases.length)}
                </span>{" "}
                of <span className="font-medium">{filteredCases.length}</span>{" "}
                cases
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  {totalPages > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card className="sticky top-20">
            {selectedCase ? (
              <>
                <CardHeader className="pb-0">
                  <CardTitle>{selectedCase.title}</CardTitle>
                  <CardDescription className="flex justify-between">
                    <span>Case ID: {selectedCase.id}</span>
                    <span>Opened: {selectedCase.dateOpened}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.description}
                    </p>
                  </div>

                  <div className="flex flex-col text-sm gap-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`
                        ${
                          selectedCase.status === "Active"
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      `}
                      >
                        {selectedCase.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Priority:</span>
                      <span
                        className={`
                        ${
                          selectedCase.priority === "Critical"
                            ? "text-red-600 dark:text-red-400"
                            : selectedCase.priority === "High"
                            ? "text-orange-600 dark:text-orange-400"
                            : selectedCase.priority === "Medium"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-green-600 dark:text-green-400"
                        }
                      `}
                      >
                        {selectedCase.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Assigned To:</span>
                      <span>{selectedCase.assignedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Progress:</span>
                      <span>{selectedCase.progress}% Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Last Updated:</span>
                      <span>{selectedCase.lastUpdated}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Crime Report</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          {selectedCase.crimeReportId}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Crime Report Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          {(() => {
                            const report = getCrimeReportById(
                              selectedCase.crimeReportId
                            );
                            if (!report) return <p>Report not found</p>;

                            return (
                              <>
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {report.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {report.id}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Type</p>
                                    <p>{report.type}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Date/Time</p>
                                    <p>
                                      {report.date} at {report.time}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Location</p>
                                    <p>{report.location}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Status</p>
                                    <p>{report.status}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">Description</p>
                                  <p className="text-sm">
                                    {report.description}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">
                                      Reporting Officer
                                    </p>
                                    <p>{report.reportingOfficer}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Assigned To</p>
                                    <p>{report.assignedTo}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">Evidence</p>
                                  <ul className="list-disc list-inside text-sm">
                                    {report.evidence.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium">Witnesses</p>
                                  <ul className="list-disc list-inside text-sm">
                                    {report.witnesses.map((witness, index) => (
                                      <li key={index}>{witness}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Case Notes</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {selectedCase.notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg border p-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{note.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {note.date}
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button className="w-full">Update Progress</Button>
                    <Button variant="outline" className="w-full">
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-muted p-3">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No Case Selected</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Select a case from the list to view details and manage
                  information
                </p>
                <Button variant="link" className="mt-4">
                  Create New Case <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
