import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import axiosConn from "@/axioscon.js";

/**
 * Custom hook for Orders component
 * Handles fetching, canceling orders and downloading invoices
 * 
 * @param {string} userId - The current user ID
 * @returns {Object} Hook state and actions
 */
export const useOrders = (userId) => {
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user orders
   */
  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/getUserOrders`, {});

      if (response.data?.status === 200 && response.data?.data) {
        const fetchedOrders = response.data.data.orders || response.data.data || [];
        setOrders(fetchedOrders);
        return fetchedOrders;
      }
      
      setOrders([]);
      return [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch orders";
      setError(errorMessage);
      console.error("Fetch orders error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setOrders([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, API_BASE_URL, toast]);

  /**
   * Cancel an order
   * 
   * @param {string} orderId - Order ID to cancel
   */
  const cancelOrder = useCallback(async (orderId) => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Order ID is missing" };
    }

    setCanceling(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/cancelOrder`, {
        orderId,
      });

      if (response.data?.status === 200 || response.data?.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully",
        });
        
        // Refresh orders list
        await fetchOrders();
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data?.message || "Failed to cancel order");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to cancel order";
      setError(errorMessage);
      console.error("Cancel order error:", err);
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setCanceling(false);
    }
  }, [API_BASE_URL, toast, fetchOrders]);

  /**
   * Download invoice for an order
   * 
   * @param {string} orderId - Order ID
   */
  const downloadInvoice = useCallback(async (orderId) => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "Order ID is missing",
        variant: "destructive",
      });
      return { success: false, error: "Order ID is missing" };
    }

    setDownloading(true);
    setError(null);
    
    try {
      const response = await axiosConn.post(`${API_BASE_URL}/downloadInvoice`, {
        orderId,
      }, {
        responseType: 'blob', // Important for file download
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully",
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to download invoice";
      setError(errorMessage);
      console.error("Download invoice error:", err);
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setDownloading(false);
    }
  }, [API_BASE_URL, toast]);

  /**
   * Get orders by status
   * 
   * @param {string} status - Order status filter
   * @returns {Array} Filtered orders
   */
  const getOrdersByStatus = useCallback((status) => {
    if (!status || status === 'all') return orders;
    return orders.filter(order => order.status?.toLowerCase() === status.toLowerCase());
  }, [orders]);

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'PENDING').length;
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const cancelled = orders.filter(o => o.status === 'CANCELLED').length;
    const failed = orders.filter(o => o.status === 'FAILED').length;

    return {
      total,
      pending,
      completed,
      cancelled,
      failed,
    };
  }, [orders]);

  /**
   * Refresh orders
   */
  const refreshOrders = useCallback(() => {
    return fetchOrders();
  }, [fetchOrders]);

  return {
    // State
    orders,
    loading,
    canceling,
    downloading,
    error,
    
    // Actions
    fetchOrders,
    cancelOrder,
    downloadInvoice,
    refreshOrders,
    
    // Computed
    getOrdersByStatus,
    stats: getOrderStats(),
    hasOrders: orders.length > 0,
    orderCount: orders.length,
    isProcessing: loading || canceling || downloading,
  };
};

export default useOrders;
