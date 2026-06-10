// SignalR client for the restaurant dashboard.
//
// We connect to the same /hubs/location the customer + driver apps use, but
// the server fires restaurant-targeted events (e.g. PartnerAssigned) directly
// to the restaurant owner's user channel — so all this client has to do is
// authenticate and bind handlers.

import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import { SERVER_URL_BASE_URL } from "@/constants";

class RestaurantLocationHub {
  private connection: signalR.HubConnection | null = null;

  async connect(): Promise<void> {
    if (
      this.connection?.state === signalR.HubConnectionState.Connected ||
      this.connection?.state === signalR.HubConnectionState.Connecting ||
      this.connection?.state === signalR.HubConnectionState.Reconnecting
    ) {
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      // No session yet — caller will retry after login.
      return;
    }

    const hubUrl = `${SERVER_URL_BASE_URL}/hubs/location`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    try {
      await this.connection.start();
    } catch (err) {
      // Don't crash the page — the order detail still polls as a fallback.
      console.warn("[SignalR] connect failed", err);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.connection?.stop();
    } catch {
      /* swallow */
    }
    this.connection = null;
  }

  // -------------------------------------------------------------------
  // Restaurant-side delivery events
  // -------------------------------------------------------------------

  onPartnerAssigned(
    cb: (data: {
      deliveryId: string;
      orderId: string;
      pickupOtp: string;
    }) => void,
  ): void {
    this.connection?.on("PartnerAssigned", cb);
  }

  offPartnerAssigned(): void {
    this.connection?.off("PartnerAssigned");
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const locationHub = new RestaurantLocationHub();
