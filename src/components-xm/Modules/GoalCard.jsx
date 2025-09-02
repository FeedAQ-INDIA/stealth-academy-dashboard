import { useState } from "react";
import { format } from "date-fns";
import axiosConn from "@/axioscon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const GoalCard = ({ goal, onGoalUpdate, onEditGoal }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleViewDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleEdit = () => {
    onEditGoal(goal);
  };

  const handleDelete = (goalId) => {
    if (!goalId) {
      console.error("Goal ID is missing");
      setDeleteConfirmation("");
      return;
    }

    setDeleteLoading(true);
    
    const requestBody = {
      userGoalId: goalId,
     };

    axiosConn
      .post("/goal/delete", requestBody)
      .then((res) => {
        onGoalUpdate(); // Refresh goals list
        setDeleteConfirmation(""); // Reset confirmation
      })
      .catch((error) => {
        console.error("Error deleting goal:", error);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-1 h-full ${
            goal.status === "COMPLETED"
              ? "bg-green-500"
              : goal.status === "IN_PROGRESS"
              ? "bg-blue-500"
              : goal.status === "ABANDONED"
              ? "bg-red-500"
              : "bg-gray-400"
          }`}
        />
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <CardDescription className="mt-1.5 line-clamp-2">
                {goal.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-gray-500">Planned Start</p>
                <p className="font-medium">
                  {format(new Date(goal.startDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-500">Target Date</p>
                <p className="font-medium">
                  {format(new Date(goal.targetDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Progress section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : goal.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : goal.status === "ABANDONED"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {goal.status.replace("_", " ")}
                </span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    goal.status === "COMPLETED"
                      ? "bg-green-500"
                      : goal.status === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : goal.status === "ABANDONED"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {/* Actual dates section */}
            {(goal.actualStartDate || goal.actualEndDate) && (
              <>
                <Separator />
                <div className="space-y-2 text-sm">
                  {goal.actualStartDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actually Started</span>
                      <span className="font-medium">
                        {format(new Date(goal.actualStartDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                  {goal.actualEndDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {goal.status === "COMPLETED" ? "Completed" : "Ended"}
                      </span>
                      <span className="font-medium">
                        {format(new Date(goal.actualEndDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <div className="flex justify-end space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="w-24"
            >
              View Details
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEdit}
              className="w-24"
            >
              Edit
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-24"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    Are You Sure You Want To Delete This Goal?
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    This action cannot be undone. Type in{" "}
                    <span className="font-semibold text-red-600 italic">
                      "{goal.title}"
                    </span>{" "}
                    in the input field below and click confirm to delete the
                    goal permanently.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-y-2">
                  <Input
                    placeholder="Type goal title to confirm deletion..."
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <DialogFooter className="sm:justify-start gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => setDeleteConfirmation("")}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    onClick={() => handleDelete(goal.id)}
                    disabled={
                      deleteLoading ||
                      goal.title?.trim() !== deleteConfirmation?.trim()
                    }
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Deleting Goal...
                      </>
                    ) : (
                      "Delete Goal"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>

      {/* Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Goal Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{goal.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{goal.description}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`mt-1 font-medium ${
                    goal.status === "COMPLETED"
                      ? "text-green-600"
                      : goal.status === "IN_PROGRESS"
                      ? "text-blue-600"
                      : goal.status === "ABANDONED"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                    {goal.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="mt-1 font-medium">{goal.progress}%</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Planned Timeline</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="mt-1">{format(new Date(goal.startDate), "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Target Date</p>
                    <p className="mt-1">{format(new Date(goal.targetDate), "MMM dd, yyyy")}</p>
                  </div>
                </div>
              </div>

              {(goal.actualStartDate || goal.actualEndDate) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">Actual Timeline</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {goal.actualStartDate && (
                        <div>
                          <p className="text-sm text-gray-500">Started On</p>
                          <p className="mt-1">{format(new Date(goal.actualStartDate), "MMM dd, yyyy")}</p>
                        </div>
                      )}
                      {goal.actualEndDate && (
                        <div>
                          <p className="text-sm text-gray-500">
                            {goal.status === "COMPLETED" ? "Completed On" : "Ended On"}
                          </p>
                          <p className="mt-1">{format(new Date(goal.actualEndDate), "MMM dd, yyyy")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Additional Information</h4>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="mt-1">{format(new Date(goal.createdAt), "MMM dd, yyyy")}</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GoalCard;
