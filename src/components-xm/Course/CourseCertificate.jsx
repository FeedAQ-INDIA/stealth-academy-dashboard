import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * CourseCertificate Component
 * Displays a certificate of completion for a course.
 * Props:
 *   - courseTitle: string
 *   - userName: string
 *   - date: string (optional)
 */
const CourseCertificate = ({ courseTitle, userName, date }) => {
  const today = date || new Date().toLocaleDateString();
  return (
    <Card className="max-w-2xl mx-auto my-12 border-2 border-dashed border-primary bg-gradient-to-br from-white via-blue-50 to-slate-100 shadow-xl rounded-2xl">
      <CardContent className="p-10">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Badge className="text-lg px-4 py-2 bg-primary/90 text-white rounded-full mb-2">Official Certificate</Badge>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide mb-1">Certificate of Completion</h2>
          <p className="text-gray-600 text-base">This is to certify that</p>
        </div>
        <div className="text-center mb-8">
          <span className="block text-4xl font-bold text-blue-700 mb-2 drop-shadow-sm">{userName}</span>
          <span className="text-gray-700 text-lg">has successfully completed the course</span>
          <span className="block text-2xl font-semibold text-green-700 mt-3">{courseTitle}</span>
        </div>
        <div className="flex justify-between items-end mt-10">
          <div className="text-left">
            <span className="block text-gray-500 text-xs">Date</span>
            <span className="block text-gray-800 font-medium text-base">{today}</span>
          </div>
          <div className="text-right">
            <span className="block text-gray-500 text-xs">Signature</span>
            <span className="block text-gray-800 font-medium text-base tracking-widest">__________________</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCertificate;
