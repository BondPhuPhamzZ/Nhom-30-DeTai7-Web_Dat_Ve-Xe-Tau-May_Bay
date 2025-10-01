using System.Web;
using System.Web.Mvc;

namespace Nhom_30_DeTai7_Web_Dat_Ve_Xe_Tau_May_Bay
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
