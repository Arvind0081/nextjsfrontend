import SideNav from '@/components/common/SideBar/sidebar';
import Footer from '@/components/common/Footer/footer';
import Header from '@/components/common/Header/header';

import { CLientModel, InvoicePaymentModel } from '@/utils/types';
import { clientList, invoicePayment, invoicePaymentStatus } from '@/utils/publicApi';
import SearchInvoice from '@/components/invoice/searchInvoice';
import InvoicesTabs from '@/components/invoice/tabs';
import CreateInvoiceViewButton from '@/components/invoice/createInvoiceViewButton';

const Invoices = async ({ searchParams }: any) => {
  let getCllientList: CLientModel[] = [];
  let paymentList: InvoicePaymentModel[] = [];
  let payment: InvoicePaymentModel[] = [];
  try {
    getCllientList = await clientList();
  } catch (error) {}

  try {
    paymentList = await invoicePaymentStatus();
  } catch (error) {}

  try {
    payment = await invoicePayment();
  } catch (error) {}

 


  let activeTab = searchParams?.tabs ?? 'Search Invoice';
  return (
    <div>
      <div className='app sidebar-mini ltr light-mode'>
        <div className='page'>
          <Header />
          <SideNav />
          <div className='main-content app-content mt-0'>
            <div className='side-app'>
              <div className='main-container container-fluid'>
                <div className='row'>
                  <div className='col-xl-8'>
                    <div className='card custom-card hidePrint'>
                      <div className='card-body'>
                        <InvoicesTabs activeTabName={activeTab} />
                        &nbsp;
                       <CreateInvoiceViewButton   getCllientList={getCllientList}/>
                      </div>

                      <div className='card-body'>
                        <div className='tab-content'>
                          {/* {activeTab == 'Create Invoice' && (
                          <CreateInvoice getCllientList={getCllientList} />
                        )} */}
                          {
                            <SearchInvoice
                              getCllientList={getCllientList}
                              paymentList={paymentList}
                              payment={payment}
                            />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invoices;
